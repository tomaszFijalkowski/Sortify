using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Sortify.Handlers.CommandHandlers.Base;
using Sortify.Handlers.QueryHandlers.Base;
using Sortify.Services;
using Sortify.Services.Interfaces;
using System;

namespace Sortify
{
    public class ServiceResolver
    {
        private static WindsorContainer container;
        private static IServiceProvider serviceProvider;

        public ServiceResolver(IServiceCollection services)
        {
            container = new WindsorContainer();

            var assemblyName = typeof(ICommandHandler).Assembly.FullName;

            container.Register(Classes.FromAssemblyNamed(assemblyName)
                .IncludeNonPublicTypes()
                .BasedOn(typeof(ICommandHandler)).WithServiceAllInterfaces().LifestyleTransient());

            container.Register(Classes.FromAssemblyNamed(assemblyName)
                .IncludeNonPublicTypes()
                .BasedOn(typeof(IQueryHandler)).WithServiceAllInterfaces().LifestyleTransient());

            container.Register(Component.For<IConnectionService>()
                .ImplementedBy<ConnectionService>().LifeStyle.Singleton);

            serviceProvider = WindsorRegistrationHelper.CreateServiceProvider(container, services);
        }

        public IServiceProvider GetServiceProvider()
        {
            return serviceProvider;
        }
    }
}
